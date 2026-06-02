import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://pokopiachronicles.com";
const DEFAULT_IMAGE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

type SeoProps = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  lang?: string;
  noIndex?: boolean;
  jsonLd?: JsonLd;
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  keywords = [],
  image = DEFAULT_IMAGE,
  type = "website",
  lang = "zh-Hant",
  noIndex = false,
  jsonLd,
}: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    const canonicalUrl = new URL(path, SITE_URL).toString();

    document.title = title;
    document.documentElement.lang = lang;

    upsertMeta("name", "description", description);
    if (keywords.length > 0) {
      upsertMeta("name", "keywords", keywords.join(", "));
    }
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:site_name", "Pokopia Chronicles");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", canonicalUrl);

    let jsonLdScript = document.getElementById("seo-jsonld") as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "seo-jsonld";
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = jsonLd ? JSON.stringify(jsonLd, null, 2) : "";
  }, [description, image, jsonLd, keywords, lang, location.pathname, location.search, noIndex, title, type]);

  return null;
}
