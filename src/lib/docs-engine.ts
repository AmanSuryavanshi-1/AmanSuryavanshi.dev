import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'src', 'content', 'docs');

export interface DocMeta {
  title: string;
  seoDescription: string;
  keywords: string[];
  projectId: string;
  category: string;
  type: string;
  schemaType: string;
  // Fallback map
  [key: string]: any;
}

export interface Doc {
  slug: string[]; // ['projects', 'clientele', 'aviators-training-centre', 'executive-summary']
  meta: DocMeta;
  content: string;
  path: string; // File path relative to docsDirectory
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

export function getAllDocs(): Doc[] {
  if (!fs.existsSync(docsDirectory)) return [];

  const files = getAllFiles(docsDirectory);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const relativePath = path.relative(docsDirectory, file);
      // Windows paths use \, replace with /
      const normalizedPath = relativePath.split(path.sep).join('/');
      const slug = normalizedPath.replace(/\.md$/, '').split('/');

      const fileContents = fs.readFileSync(file, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        meta: data as DocMeta,
        content,
        path: normalizedPath
      };
    })
    .sort((a, b) => (a.slug.join('/') > b.slug.join('/') ? 1 : -1));
}

export function getDocBySlug(slugPath: string[]): Doc | null {
  const docs = getAllDocs();
  const targetSlug = slugPath.join('/');
  
  // 1. Direct exact match on physical slug path
  const directMatch = docs.find(doc => doc.slug.join('/') === targetSlug);
  if (directMatch) return directMatch;

  // 2. Short clean URL resolution (strictly 2 segments: [projectSlug, docSlug])
  if (slugPath.length === 2) {
    const projectKey = slugPath[0].toLowerCase();
    const docKey = slugPath[1].toLowerCase();

    const matched = docs.find(doc => {
      const docProject = (doc.meta.projectId || (doc.slug.length >= 2 ? doc.slug[doc.slug.length - 2] : '')).toLowerCase();
      const docFile = doc.slug[doc.slug.length - 1].toLowerCase();
      const docFolder = doc.slug.length >= 2 ? doc.slug[doc.slug.length - 2].toLowerCase() : '';
      return (docProject === projectKey || docFolder === projectKey) && docFile === docKey;
    });
    if (matched) return matched;
  }

  return null;
}

export function getCanonicalDocSlug(doc: Doc): string[] {
  if (doc.slug.length >= 2) {
    return [doc.slug[doc.slug.length - 2], doc.slug[doc.slug.length - 1]];
  }
  return doc.slug;
}

export function getDocsByProjectId(projectId: string): Doc[] {
    const docs = getAllDocs();
    return docs.filter(doc => doc.meta.projectId === projectId);
}
