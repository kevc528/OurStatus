
export interface Account {
    username: string;
    // store own tasks and assigned tasks - don't need to look through a bunch of tasks
    // might make my_task_ids (user is the creator), and assigned_task_ids
    // completed tasks might have to be queried for the past 5 days or smth
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    friends: string[];
    groupIds: number[];
    picture: string;
}