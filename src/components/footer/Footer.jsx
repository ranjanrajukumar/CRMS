import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const translateText = (text) => t(`appText.${text}`, { defaultValue: text });

  return (
    <footer className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-1px_4px_rgba(15,23,42,0.08)] md:px-8">
      <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{translateText("Copyright 2026 CRMS. All rights reserved.")}</p>
        <p>{translateText("Customer management made simple.")}</p>
      </div>
    </footer>
  );
}

export default Footer;
