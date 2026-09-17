"use client";

import { useEffect } from "react";
import { Locale, isRtl } from "@/i18n/config";

export function HtmlLangSync({ locale }: { locale: Locale }) {
    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
    }, [locale]);

    return null;
}
