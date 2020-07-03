export interface Task {
    // id: string;
    // don't need id because when tasks are read in from the user, we can assign associate task and key
    // using some sort of TaskKey object
    id: string;
    creatorUsername: string;
    assignees: string[];
    title: string;
    dateCreated: Date;
    dateCompleted: Date;
    targetDate: Date;
    remind: boolean;
    level: number;
}