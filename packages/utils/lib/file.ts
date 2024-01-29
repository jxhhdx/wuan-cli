import * as fs from 'fs';

interface WriteFileOptions {
  rewrite?: boolean;
}

interface ReadFileOptions {
  toJson?: boolean;
}

function writeFile(path: string, data: string | Buffer, { rewrite = true }: WriteFileOptions = {}): boolean {
  if (fs.existsSync(path)) {
    if (rewrite) {
      fs.writeFileSync(path, data);
      return true;
    } else {
      return false;
    }
  } else {
    fs.writeFileSync(path, data);
    return true;
  }
}

function readFile(path: string, options: ReadFileOptions = {}): string | Buffer | null {
  if (fs.existsSync(path)) {
    const buffer = fs.readFileSync(path);
    if (buffer) {
      if (options.toJson) {
        return buffer.toJSON() as unknown as Buffer;
      } else {
        return buffer.toString();
      }
    }
  } 
  return null;
}

export {
  readFile,
  writeFile,
};
