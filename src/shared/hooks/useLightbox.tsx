import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Slide = { src: string };

export function useLightbox() {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  const openLightbox = (startIndex: number, newSlides: Slide[]) => {
    setSlides(newSlides);
    setIndex(startIndex);
    setOpen(true);
  };

  const closeLightbox = () => setOpen(false);

  const LightboxViewer = () => (
    <Lightbox
      open={open}
      slides={slides}
      index={index}
      close={closeLightbox}
      plugins={[Thumbnails]}
      noScroll={{ disabled: true }}
    />
  );

  return { openLightbox, LightboxViewer };
}