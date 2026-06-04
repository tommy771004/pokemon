import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://pokemoninfoperfer.vercel.app";
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

function upsertAlternateLink(hreflang: string, href: string) {
  let element = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", hreflang);
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

    // Core SEO tags
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

    // Multilingual SEO support (hreflang annotations)
    const urlWithoutQuery = new URL(location.pathname, SITE_URL).toString();
    const queryParams = new URLSearchParams(location.search);
    
    // Create query strings for alternates
    queryParams.set("lng", "zh");
    const alternateZh = `${urlWithoutQuery}?${queryParams.toString()}`;
    queryParams.set("lng", "en");
    const alternateEn = `${urlWithoutQuery}?${queryParams.toString()}`;

    upsertAlternateLink("zh-Hant", alternateZh);
    upsertAlternateLink("zh", alternateZh);
    upsertAlternateLink("en", alternateEn);
    upsertAlternateLink("x-default", alternateZh); // Defaulting to Traditional Chinese

    // Dynamic JSON-LD script mounting
    let jsonLdScript = document.getElementById("seo-jsonld") as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "seo-jsonld";
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }

    // Standard schema building with automatic BreadcrumbList integration
    const isEn = lang.startsWith("en");
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "首頁",
        item: SITE_URL,
      }
    ];

    if (location.pathname !== "/") {
      const parts = location.pathname.split("/").filter(Boolean);
      let cumulativePath = "";
      parts.forEach((part, index) => {
        cumulativePath += `/${part}`;
        let humanName = part;
        if (part === "pokedex") humanName = isEn ? "Pokédex" : "圖鑑";
        else if (part === "map") humanName = isEn ? "Explore Map" : "探索地圖";
        else if (part === "characters") humanName = isEn ? "Characters" : "角色劇情";
        else if (part === "guide") humanName = isEn ? "Strategic Guides" : "戰術指南";

        breadcrumbItems.push({
          "@type": "ListItem",
          position: index + 2,
          name: humanName,
          item: `${SITE_URL}${cumulativePath}`,
        });
      });
    }

    // Dynamic guide sub-item breadcrumb
    const guideIdParam = new URLSearchParams(location.search).get("id");
    if (location.pathname === "/guide" && guideIdParam) {
      let finalGuideName = guideIdParam;
      if (guideIdParam === "meta-history") finalGuideName = isEn ? "Meta History" : "歷史設定";
      else if (guideIdParam === "regional-walkthrough") finalGuideName = isEn ? "Regional Walkthrough" : "區域攻略";
      else if (guideIdParam === "beginner-tips") finalGuideName = isEn ? "Beginner Tips" : "新手手冊";
      else if (guideIdParam === "legendary-encounters") finalGuideName = isEn ? "Legendary Encounters" : "傳說遭遇";

      breadcrumbItems.push({
        "@type": "ListItem",
        position: breadcrumbItems.length + 1,
        name: finalGuideName,
        item: `${SITE_URL}/guide?id=${guideIdParam}`,
      });
    }

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    };

    // Combine custom page-specific JSON-LD and general breadcrumbs
    const finalSchemas = [];
    if (jsonLd) {
      finalSchemas.push(jsonLd);
    }
    finalSchemas.push(breadcrumbJsonLd);

    jsonLdScript.textContent = JSON.stringify(finalSchemas, null, 2);
  }, [description, image, jsonLd, keywords, lang, location.pathname, location.search, noIndex, title, type]);

  return null;
}
