import { User } from "../../entity/User";

// Extend Express Request to include lecturer information
declare global {
    namespace Express {
        interface Request {
            lecturer?: User;
        }
    }
}
