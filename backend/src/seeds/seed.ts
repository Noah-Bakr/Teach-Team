import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Role }     from "../entity/Role";
import { User }     from "../entity/User";
import { Skills }   from "../entity/Skills";
import { Course }   from "../entity/Course";
import { Application } from "../entity/Application";
import { AcademicCredential }     from "../entity/AcademicCredential";
import { PreviousRole }           from "../entity/PreviousRole";
import { Review } from "../entity/Review";


import {
    SEED_USERS,
    SEED_COURSES,
    SEED_APPLICATIONS,
    SEED_REVIEWS,
} from "./testData";

import * as argon2 from "argon2";

export async function seed() {
    const ds = AppDataSource;
    if (!ds.isInitialized) {
        await ds.initialize();
    }

    //
    // SKILLS
    //
    const skillsRepo = ds.getRepository(Skills);
    if ((await skillsRepo.count()) === 0) {
        console.log("  ->Seeding Skills…");
        const skillNames = [
            "Java", "Python", "C++", "Blockchain", "Cryptography", "Distributed Systems",
            "Network Security", "Ethical Hacking", "Data Analysis", "Machine Learning",
            "JavaScript", "React", "CSS", "Android", "iOS", "AWS", "Docker", "Kubernetes",
        ];
        await skillsRepo.save(skillNames.map(name => ({skill_name: name})));
    }

    //
    // ROLES
    //
    const roleRepo = ds.getRepository(Role);
    if ((await roleRepo.count()) === 0) {
        console.log("  -> Seeding Roles…");
        await roleRepo.save([
            {role_name: "admin"},
            {role_name: "lecturer"},
            {role_name: "candidate"},
        ]);
    }

    //
    // COURSES
    //
    const courseRepo = ds.getRepository(Course);
    if ((await courseRepo.count()) === 0) {
        console.log("  -> Seeding Courses…");
        const courses = await courseRepo.save(
            SEED_COURSES.map(c => ({
                course_name: c.course_name,
                course_code: c.course_code,
                semester: c.semester
            }))
        );
        // link skills
        for (let i = 0; i < SEED_COURSES.length; i++) {
            const skillIds = SEED_COURSES[i].skill_ids || [];
            if (skillIds.length) {
                await courseRepo
                    .createQueryBuilder()
                    .relation(Course, "skills")
                    .of(courses[i])
                    .add(skillIds);
            }
        }
    }

    //
    // USERS + extras
    //
    const userRepo = ds.getRepository(User);
    for (const u of SEED_USERS) {
        const existing = await userRepo.findOneBy({username: u.username});
        if (existing) {
            console.log(` -> User ${u.username} already exists, skipping`);
            continue;
        }

        const pwdHash = await argon2.hash(u.password);
        const user = userRepo.create({
            username: u.username,
            email: u.email,
            password: pwdHash,
            role: {role_id: u.role_id},
            first_name: u.first_name,
            last_name: u.last_name,
            avatar: u.avatar,
        });
        const saved = await userRepo.save(user);
        console.log(` -> Seeded user ${u.username}`);

        // link skills
        if (u.skill_ids?.length) {
            for (const sid of u.skill_ids) {
                const s = await skillsRepo.findOneBy({ skill_id: sid });
                if (!s) {
                    console.warn(`Skill ID ${sid} not found, skipping link.`);
                }
            }
            await userRepo
                .createQueryBuilder()
                .relation(User, "skills")
                .of(saved)
                .add(u.skill_ids);
        }

        // Link academic credentials
        if (u.academic_credentials?.length) {
            for (const ac of u.academic_credentials) {
                // 1) create the AcademicCredential row
                const credential = await ds.getRepository(AcademicCredential).save({
                    degree_name: ac.degree_name,
                    institution: ac.institution,
                    start_date: ac.start_date,
                    end_date: ac.end_date,
                    description: ac.description,
                });

                await userRepo
                    .createQueryBuilder()
                    .relation(User, "academicCredentials")
                    .of(saved)
                    .add(credential.academic_id);
            }
        }

        // previous roles
        if (u.previous_roles?.length) {
            const prevRepo = ds.getRepository(PreviousRole);
            for (const pr of u.previous_roles) {
                await prevRepo.save({
                    previous_role: pr.previous_role,
                    company: pr.company,
                    start_date: pr.start_date,
                    end_date: pr.end_date,
                    description: pr.description,
                    user: saved,
                });
            }
        }
    }

    // Attach Courses to Lecturers
    for (const u of SEED_USERS) {
        if (u.role_id !== 2 || !Array.isArray(u.course_codes) || u.course_codes.length === 0) {
            continue;
        }

        // Find the lecturer in the database
        const lecturer = await userRepo.findOneByOrFail({ username: u.username });

        // Look up all the Course IDs
        const desiredCourseIds: number[] = [];
        for (const code of u.course_codes!) {
            const course = await courseRepo.findOneBy({ course_code: code });
            if (!course) {
                console.warn(`Course code "${code}" not found, skipping`);
                continue;
            }
            desiredCourseIds.push(course.course_id);
        }
        if (desiredCourseIds.length === 0) {
            console.log(`No valid course_codes for lecturer ${u.username}`);
            continue;
        }

        // Fetch all course IDs that are ALREADY linked to this lecturer
        const existingCourseRelations: { course_id: number }[] =
            await userRepo
                .createQueryBuilder("user")
                .relation(User, "courses")
                .of(lecturer)
                .loadMany<{ course_id: number }>();

        // Extract just the IDs
        const alreadyLinkedIds = new Set(existingCourseRelations.map(r => r.course_id));

        // Filter out any course_id talready linked
        const courseIdsToAdd = desiredCourseIds.filter(id => !alreadyLinkedIds.has(id));
        if (courseIdsToAdd.length === 0) {
            console.log(`  → Lecturer ${u.username} already has all desired courses; skipping.`);
            continue;
        }

        // Only add  new IDs
        await userRepo
            .createQueryBuilder()
            .relation(User, "courses")
            .of(lecturer)
            .add(courseIdsToAdd);

        console.log(
            `  Attached new courses [${courseIdsToAdd.join(", ")}] → lecturer ${u.username}`
        );
    }


    //
    // APPLICATIONS
    //
    const appRepo = ds.getRepository(Application);
    for (const a of SEED_APPLICATIONS) {
        const user = await userRepo.findOneByOrFail({username: a.user_username});
        const course = await courseRepo.findOneByOrFail({course_code: a.course_code});

        const already = await appRepo.findOne({
            where: {
                user: {user_id: user.user_id},
                course: {course_id: course.course_id},
                position_type: a.position_type,
            }
        });
        if (already) {
            console.log(` -> Application for ${a.user_username} → ${a.course_code} exists, skipping`);
            continue;
        }

        await appRepo.save({
            position_type: a.position_type,
            status: a.status,
            applied_at: new Date(a.applied_at),
            selected: a.selected,
            availability: a.availability,
            user,
            course,
        });
        console.log(` -> Seeded application ${a.user_username} → ${a.course_code}`);
    }

    // REVIEWS
    //
    const reviewRepo = ds.getRepository(Review);
    for (const r of SEED_REVIEWS) {
        const already = await reviewRepo.findOne({
            where: {
                lecturer_id: r.lecturer_id,
                application_id: r.application_id,
            },
        });
        if (already) {
            console.log(
                `Review by lecturer ${r.lecturer_id} for application ${r.application_id} exists, skipping`
            );
            continue;
        }

        await reviewRepo.save({
            lecturer_id: r.lecturer_id,
            application_id: r.application_id,
            rank: r.rank ?? null,
            comment: r.comment ?? null,
        });
        console.log(
            `Seeded review lecturer=${r.lecturer_id} → application=${r.application_id}`
        );
    }
}