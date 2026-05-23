import './Image.scss';
export function Image({ src, alt }: { src: string; alt: string }) {
  return <img className="health-image au-responsive-media-img" src={src} alt={alt} />;
}
