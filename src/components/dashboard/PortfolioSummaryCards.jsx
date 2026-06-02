import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

function PortfolioSummaryCards({
  cards,
  loading,
  error,
  selectedPortfolio,
  onSelectPortfolio,
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const translateText = (text, options = {}) =>
    t(`appText.${text}`, { defaultValue: text, ...options });

  const visibleCards = useMemo(() => {
    const filteredCards = cards.filter((card) =>
      String(card.label).toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    if (sortBy === "highest") {
      return [...filteredCards].sort(
        (first, second) => Number(second.value) - Number(first.value)
      );
    }

    if (sortBy === "lowest") {
      return [...filteredCards].sort(
        (first, second) => Number(first.value) - Number(second.value)
      );
    }

    if (sortBy === "name") {
      return [...filteredCards].sort((first, second) =>
        String(first.label).localeCompare(String(second.label))
      );
    }

    return filteredCards;
  }, [cards, searchTerm, sortBy]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {translateText("Portfolio Summary Details")}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {translateText("Showing portfolio totals from the latest dashboard data")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={translateText("Search portfolio")}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white sm:w-56"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="latest">{translateText("Latest")}</option>
            <option value="highest">{translateText("Highest Count")}</option>
            <option value="lowest">{translateText("Lowest Count")}</option>
            <option value="name">{translateText("Name A-Z")}</option>
          </select>
        </div>
      </div>

      <div className="max-h-[calc(100dvh-260px)] overflow-y-auto overflow-x-hidden pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[104px] animate-pulse rounded-sm border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-6 w-16 rounded bg-slate-100" />
                <div className="mt-5 h-3 w-24 rounded bg-slate-100" />
                <div className="mt-3 h-px w-full bg-slate-200" />
              </div>
            ))}

          {!loading &&
            visibleCards.map((card) => {
              const isSelected = selectedPortfolio === card.label;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onSelectPortfolio?.(card)}
                  className={`group rounded-sm border bg-white px-5 py-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSelected
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-slate-200"
                  }`}
                  aria-pressed={isSelected}
                >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-3xl font-light leading-none text-blue-900">
                      {card.value}
                    </p>
                    <p className="mt-3 truncate text-sm font-medium text-slate-400">
                      {card.label}
                    </p>
                  </div>

                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition group-hover:bg-slate-100 group-hover:text-blue-700"
                    aria-hidden="true"
                    title={translateText("View {{name}}", { name: card.label })}
                  >
                    <Eye size={28} strokeWidth={1.8} />
                  </span>
                </div>

                <div className="mt-3 h-px bg-slate-300" />
                </button>
              );
            })}

          {!loading && !error && visibleCards.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 md:col-span-2 xl:col-span-4">
              {translateText("No portfolio data found.")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSummaryCards;
