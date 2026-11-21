import { hydrateRoot } from "react-dom/client";
import Storefront from "./Storefront";
import type { StorePage } from "./Storefront";

const page = document.body.dataset.page as StorePage;
hydrateRoot(document.getElementById("storefront")!, <Storefront page={page || "home"} />);
