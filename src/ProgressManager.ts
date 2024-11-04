import { MultiBar, SingleBar } from "cli-progress";

class ProgressManager {
    private progressBarInstances: SingleBar[] = [];
    private isCreated: boolean = false;
    private multibar = new MultiBar({
        clearOnComplete: true,
        hideCursor: true,
        format: '{taskTitle}|{state}|{threadName}|{bar}|{percentage}% ({value}/{total})|',

    });

    public createProgressBars() {
        this.progressBarInstances[0] = this.multibar.create(10, 0, { state: "IDLE", threadName: "Main    ", taskTitle: "Configuring threads...\n" }, { barCompleteChar: "█" });
        this.progressBarInstances[1] = this.multibar.create(10, 0, { state: "IDLE", threadName: "Thread 1", taskTitle: "" }, { barCompleteChar: "█" });
        this.progressBarInstances[2] = this.multibar.create(10, 0, { state: "IDLE", threadName: "Thread 2", taskTitle: "" }, { barCompleteChar: "█" });
        this.progressBarInstances[3] = this.multibar.create(10, 0, { state: "IDLE", threadName: "Thread 3", taskTitle: "" }, { barCompleteChar: "█" });
        this.progressBarInstances[4] = this.multibar.create(10, 0, { state: "IDLE", threadName: "Thread 4", taskTitle: "" }, { barCompleteChar: "█" });

        this.isCreated = true;
    }

    public updateThreadProgress(threadId: number, value: number) {
        if (!this.isCreated) return;

        const total = this.progressBarInstances[threadId].getTotal();
        this.progressBarInstances[threadId].update(value, { state: value == total ? "COMPLETE" : "ACTIVE", threadName: `Thread ${threadId}` });
    }
};

export { ProgressManager };
