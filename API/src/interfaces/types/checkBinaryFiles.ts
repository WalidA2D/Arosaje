import { isBinaryFileSync } from 'isbinaryfile';
import * as fs from 'fs';
import * as path from 'path';

function checkFiles(directory: string) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        // Exclude node_modules directory
        if (stat.isDirectory()) {
            if (file !== 'node_modules') {
                checkFiles(fullPath);
            }
        } else if (fullPath.endsWith('.ts')) {
            if (isBinaryFileSync(fullPath)) {
                console.log(`Binary file detected: ${fullPath}`);
            } else {
                console.log(`Text file: ${fullPath}`);
            }
        }
    });
}

// Run the check from the specified directory
const directoryToCheck = path.resolve(__dirname, '../../..');
checkFiles(directoryToCheck);
