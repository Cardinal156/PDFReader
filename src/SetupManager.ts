import { exec } from 'child_process';
import chalk from "chalk";

let ran = false;
class SetupManager {
    private promptForFilePath(title: string, fileExtension: string, filterTitle: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // PowerShell command to open File Explorer dialog
            const command = `
                Add-Type -AssemblyName System.Windows.Forms;

                # Create a hidden topmost form otherwise any prompt after the 1st will appear under other apps. Very strange bug... And it adds a cool icon on the form's prompt.
                $form = New-Object System.Windows.Forms.Form;
                $form.TopMost = $true;
                $form.ShowInTaskbar = $false;
                $form.WindowState = [System.Windows.Forms.FormWindowState]::Minimized;

                $file = New-Object System.Windows.Forms.OpenFileDialog;
                $file.Filter = "${filterTitle}|*.${fileExtension}";
                $file.Title = "${title}";
                if($file.ShowDialog($form) -eq [System.Windows.Forms.DialogResult]::OK) {
                    Write-Output $file.FileName
                }

                $form.Dispose();
            `;

            const child = exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
                //console.log(`Title: ${title}, stdout: ${stdout}, stderr: ${stderr}`);
                if (error) {
                    throw new Error(chalk.red(`Error: ${error.message}`));
                }
                const filePath = stdout.trim();
                if (!filePath) {
                    throw new Error(chalk.red(`No file selected. You must provide a ${fileExtension.toUpperCase()} file for the program to work.`));
                } else {
                    resolve(filePath);
                }


                child.kill(1);
            });

        });
    }

    public async requestPDF(): Promise<string> {
        return await this.promptForFilePath("Select a PDF file.", "pdf", "PDF Files (*.pdf)");
    }

    public async requestAudio(): Promise<string> {
        return await this.promptForFilePath("Select an audio file.", "mp3", "MP3 Files (*.mp3)");
    }
}

export { SetupManager };
