import { BrandMark } from "kambradu";

/** The mark on its own. */
export const Mark = () => <BrandMark />;

/** How the header uses it: mark plus wordmark, once per screen. */
export const WithWordmark = () => (
  <a className="brand" href="#" aria-label="Kambradu home">
    <BrandMark />
    <strong>Kambradu</strong>
  </a>
);
