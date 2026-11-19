import { hydrateRoot } from "react-dom/client";
import Storefront from "./Storefront";

hydrateRoot(document.getElementById("storefront")!, <Storefront />);
