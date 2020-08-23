export interface Task {
    // id: string;
    // don't need id because when tasks are read in from the user, we can assign associate task and key
    // using some sort of TaskKey object
    id: string;
    creatorId: string;
    assignees: string[];
    title: string;
    dateCreated: any;
    dateCompleted: any;
    targetDate: any;
    remind: boolean;
    // 0 for personal, 1 for group
    level: number;
    likes: number;
    likedUsers: string[];
    creatorUsername?: string;
    creatorName?: string;
    creatorPicture?: string;
}