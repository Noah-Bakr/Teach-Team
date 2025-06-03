import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    ValidateIf,
} from 'class-validator';

export enum PositionType {
    TUTOR = 'tutor',
    LAB_ASSISTANT = 'lab_assistant',
}

export enum StatusType {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export enum AvailabilityType {
    FULL_TIME = 'Full-Time',
    PART_TIME = 'Part-Time',
    NOT_AVAILABLE = 'Not Available',
}

export class CreateApplicationDto {
    @IsEnum(PositionType, { message: 'position_type must be tutor or lab_assistant' })
    position_type: PositionType;

    @IsEnum(StatusType, { message: 'status must be pending, accepted or rejected' })
    status: StatusType;

    @IsBoolean({ message: 'selected must be boolean' })
    selected: boolean;

    @IsEnum(AvailabilityType, { message: 'availability must be Full-Time, Part-Time or Not Available' })
    availability: AvailabilityType;

    @IsInt({ message: 'user_id must be an integer' })
    user_id: number;

    @IsInt({ message: 'course_id must be an integer' })
    course_id: number;

}

export class UpdateApplicationDto {
    @IsOptional()
    @IsEnum(PositionType, { message: 'position_type must be tutor or lab_assistant' })
    position_type?: PositionType;

    @IsOptional()
    @IsEnum(StatusType, { message: 'status must be pending, accepted or rejected' })
    status?: StatusType;

    @IsOptional()
    @IsBoolean({ message: 'selected must be boolean' })
    selected?: boolean;

    @IsOptional()
    @IsEnum(AvailabilityType, { message: 'availability must be Full-Time, Part-Time or Not Available' })
    availability?: AvailabilityType;

}
