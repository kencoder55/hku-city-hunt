/**
 * Generate an S3 key with timestamp-based filename.
 * Format: {folder}/{YYYYMMDD}-{HHmmss}-{4hex}.{ext}
 * Example: images/20260224-153045-a3f2.jpg
 */
export function generateS3Key(folder: string, originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const rand = Math.random().toString(16).slice(2, 6);
  return `${folder}/${date}-${time}-${rand}.${ext}`;
}
