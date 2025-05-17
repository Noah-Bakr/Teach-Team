CREATE TABLE `User` (
                        user_id    INT(10) NOT NULL AUTO_INCREMENT,
                        username   VARCHAR(255) NOT NULL UNIQUE,
                        email      VARCHAR(255) NOT NULL UNIQUE,
                        password   VARCHAR(255) NOT NULL,
                        created_at DATE,
                        first_name VARCHAR(255),
                        last_name  VARCHAR(255),
                        avatar     VARCHAR(255),
                        role_id    INT(10) NOT NULL,
                        PRIMARY KEY (user_id),
                        CONSTRAINT FKUserRole FOREIGN KEY (role_id) REFERENCES Role (role_id)
);

CREATE TABLE `Role` (
                        role_id   INT(10) NOT NULL AUTO_INCREMENT,
                        role_name ENUM('admin', 'lecturer', 'tutor') NOT NULL,
                        PRIMARY KEY (role_id)
);

CREATE TABLE `Course` (
                          course_id   INT(10) NOT NULL AUTO_INCREMENT,
                          course_name VARCHAR(255) NOT NULL,
                          course_code VARCHAR(255) NOT NULL UNIQUE,
                          semester    VARCHAR(255) NOT NULL,
                          PRIMARY KEY (course_id)
);

CREATE TABLE `Application` (
                               application_id INT(10) NOT NULL AUTO_INCREMENT,
                               position_type      ENUM('tutor', 'lab_assistant') NOT NULL,
                              status         ENUM('pending', 'accepted', 'rejected') NOT NULL,
                              applied_at     DATE,
                              selected       BOOLEAN,
                              availability   ENUM('Full-Time', 'Part-Time', 'Not Available'),
                              rank           INT(10),
                              user_id        INT(10) NOT NULL,
                              course_id      INT(10) NOT NULL,
                              PRIMARY KEY (application_id),
                              CONSTRAINT FKApplicationUser FOREIGN KEY (user_id) REFERENCES `User` (user_id),
                              CONSTRAINT FKApplicationCourse FOREIGN KEY (course_id) REFERENCES `Course` (course_id)
);

CREATE TABLE `Skills` (
                          skill_id   INT(10) NOT NULL AUTO_INCREMENT,
                          skill_name VARCHAR(255) NOT NULL,
                          PRIMARY KEY (skill_id)
);

CREATE TABLE `Skills_User` (
                               user_id  INT(10) NOT NULL,
                               skill_id INT(10) NOT NULL,
                               PRIMARY KEY (user_id, skill_id),
                               CONSTRAINT FKSkillsId FOREIGN KEY (skill_id) REFERENCES Skills (skill_id),
                               CONSTRAINT FKSkillsUser FOREIGN KEY (user_id) REFERENCES `User` (user_id)
);

CREATE TABLE `Skills_Course` (
                                 course_id INT(10) NOT NULL,
                                 skill_id  INT(10) NOT NULL,
                                 PRIMARY KEY (course_id, skill_id),
                                 CONSTRAINT FKSkCrseSkillId FOREIGN KEY (skill_id) REFERENCES Skills (skill_id),
                                 CONSTRAINT FKSkCrseCourseId FOREIGN KEY (course_id) REFERENCES `Course` (course_id)
);

CREATE TABLE `AcademicCredential` (
                                      academic_id INT(10) NOT NULL AUTO_INCREMENT,
                                      degree_name VARCHAR(255) NOT NULL,
                                      institution VARCHAR(255) NOT NULL,
                                      start_date  DATE NOT NULL,
                                      end_date    DATE,
                                      description TEXT,
                                      PRIMARY KEY (academic_id)
);

CREATE TABLE `AcademicCredential_User` (
                                           user_id     INT(10) NOT NULL,
                                           academic_id INT(10) NOT NULL,
                                           PRIMARY KEY (user_id, academic_id),
                                           CONSTRAINT FKAcademicId FOREIGN KEY (academic_id) REFERENCES AcademicCredential (academic_id),
                                           CONSTRAINT FKAcademicUserId FOREIGN KEY (user_id) REFERENCES `User` (user_id)
);

CREATE TABLE `Comment` (
                           comment_id    INT(10) NOT NULL AUTO_INCREMENT,
                           comment       TEXT,
                           created_at    DATE NOT NULL,
                           updated_at    DATE NOT NULL,
                           application_id INT(10) NOT NULL,
                           lecturer_id   INT(10) NOT NULL,
                           PRIMARY KEY (comment_id),
                           CONSTRAINT FKCommentAppId FOREIGN KEY (application_id) REFERENCES Application (application_id),
                           CONSTRAINT FKLecturerId FOREIGN KEY (lecturer_id) REFERENCES `User` (user_id)
);

CREATE TABLE `Lecturer_Course` (
                                   user_id     INT(10) NOT NULL,
                                   course_id   INT(10) NOT NULL,
                                   PRIMARY KEY (user_id, course_id),
                                   CONSTRAINT FKLecturerUserId FOREIGN KEY (user_id) REFERENCES `User` (user_id),
                                   CONSTRAINT FKLecturerCourseId FOREIGN KEY (course_id) REFERENCES `Course` (course_id)
);

CREATE TABLE `PreviousRole` (
                                previous_role_id INT(10) NOT NULL AUTO_INCREMENT,
                                previous_role    VARCHAR(255) NOT NULL,
                                company          VARCHAR(255) NOT NULL,
                                start_date       DATE NOT NULL,
                                end_date         DATE,
                                description      TEXT,
                                user_id          INT(10) NOT NULL,
                                PRIMARY KEY (previous_role_id),
                                CONSTRAINT FKPreviousRoleUserId FOREIGN KEY (user_id) REFERENCES `User` (user_id)
);
