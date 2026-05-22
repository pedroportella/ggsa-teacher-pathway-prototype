import type { ReactNode } from 'react';
import './Figure.scss';
export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: ReactNode }) { return <figure className="health-figure"><img className="au-responsive-media-img" src={src} alt={alt} />{caption && <figcaption>{caption}</figcaption>}</figure>; }
