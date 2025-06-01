import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Role }     from "../entity/Role";
import { User }     from "../entity/User";
import { Skills }   from "../entity/Skills";
import { Course }   from "../entity/Course";
import { Application } from "../entity/Application";
import { LecturerCourse } from "../entity/LecturerCourse";
import { AcademicCredential }     from "../entity/AcademicCredential";
import { PreviousRole }           from "../entity/PreviousRole";
import { AcademicCredentialUser } from "../entity/AcademicCredentialUser";

import {
    SEED_USERS,
    SEED_COURSES,
    SEED_APPLICATIONS,
    SEED_LECTURER_COURSES
} from "./testData";

import * as argon2 from "argon2";

export async function seed() {
    const ds = AppDataSource;
    if (!ds.isInitialized) {
        await ds.initialize();
    }

    //
    // 1) SKILLS
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
    // 2) ROLES
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
    // 3) COURSES
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
            const ids = SEED_COURSES[i].skill_ids || [];
            if (ids.length) {
                await courseRepo
                    .createQueryBuilder()
                    .relation(Course, "skills")
                    .of(courses[i])
                    .add(ids);
            }
        }
    }

    //
    // 4) USERS + extras
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
            await userRepo
                .createQueryBuilder()
                .relation(User, "skills")
                .of(saved)
                .add(u.skill_ids);
        }

        // academic credentials
        if (u.academic_credentials?.length) {
            const credRepo = ds.getRepository(AcademicCredential);
            const acUserRepo = ds.getRepository(AcademicCredentialUser);

            for (const ac of u.academic_credentials) {
                // 1) create the credential
                const credential = await credRepo.save({
                    degree_name: ac.degree_name,
                    institution: ac.institution,
                    start_date: ac.start_date,
                    end_date: ac.end_date,
                    description: ac.description,
                });

                await userRepo
                    .createQueryBuilder()
                    .relation(User, "academicCredentialUsers")
                    .of(user)
                    .add({
                        user_id: user.user_id,
                        academic_id: credential.academic_id,
                    });

                // 2) save the join row
                await acUserRepo.save({
                    user: saved,
                    academicCredential: credential,
                });
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

    //
    // 5) APPLICATIONS
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

    //
    // 6) LECTURER_COURSE
    //
    const lcRepo = ds.getRepository(LecturerCourse);
    for (const link of SEED_LECTURER_COURSES) {
        const lect = await userRepo.findOneByOrFail({username: link.lecturerUsername});
        const crs = await courseRepo.findOneByOrFail({course_code: link.courseCode});

        const exists = await lcRepo.findOne({
            where: {
                // match on the FK columns
                user_id: lect.user_id,
                course_id: crs.course_id,
            }
        });
        if (exists) {
            console.log(` -> LecturerCourse link ${link.lecturerUsername}–${link.courseCode} exists, skipping`);
            continue;
        }

        // explicitly set the two PK columns:
        await lcRepo.save({
            user_id: lect.user_id,
            course_id: crs.course_id,
        });
        console.log(` -> Seeded LecturerCourse ${link.lecturerUsername}–${link.courseCode}`);
    }
}