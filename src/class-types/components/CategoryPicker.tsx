import { useId, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useCategoriesQuery } from "@/api/categories/categories.api";
import {
  findSelectedCategory,
  getCategoryPickerGroups,
} from "@/class-types/utils/class-types.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/classnames.utils";

// Categories are grouped by parent and searched locally. Only leaf categories
// are options; parents are headings.
export function CategoryPicker({
  value,
  onChange,
  invalid,
  describedBy,
  id,
}: {
  value: string;
  onChange: (categoryId: string) => void;
  invalid: boolean;
  describedBy?: string;
  id: string;
}) {
  const { t, dateLocale } = useI18n();
  const categoriesQuery = useCategoriesQuery();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchId = useId();

  const categories = categoriesQuery.data;

  if (categoriesQuery.isError && !categories) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
        <p role="alert">{t("classTypes.categoriesLoadError")}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => categoriesQuery.refetch()}
        >
          {t("auth.retry")}
        </Button>
      </div>
    );
  }

  const selected = categories ? findSelectedCategory(categories, value) : null;
  const groups = categories
    ? getCategoryPickerGroups(categories, search, dateLocale)
    : [];

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  }

  function select(categoryId: string) {
    onChange(categoryId);
    handleOpenChange(false);
  }

  return (
    // modal: the picker sits inside a modal dialog, which blocks wheel
    // scrolling in anything portaled outside it. A modal popover allows
    // scrolling within its own content.
    <Popover modal open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={!categories}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(
            "h-9 w-full justify-between rounded-lg bg-background font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {!categories
              ? t("classTypes.categoriesLoading")
              : selected
                ? selected.parentName
                  ? `${selected.parentName} · ${selected.name}`
                  : selected.name
                : t("classTypes.categoryPlaceholder")}
          </span>
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) gap-2 p-2"
      >
        <Input
          id={searchId}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label={t("classTypes.categorySearch")}
          placeholder={t("classTypes.categorySearch")}
          className="rounded-lg bg-background"
        />
        <div className="max-h-64 overflow-y-auto">
          {groups.length === 0 ? (
            <p role="status" className="px-2 py-3 text-muted-foreground">
              {t("classTypes.categoryNoMatches")}
            </p>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                role="group"
                aria-labelledby={
                  group.label ? `${searchId}-${group.id}` : undefined
                }
              >
                {group.label ? (
                  <p
                    id={`${searchId}-${group.id}`}
                    className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground"
                  >
                    {group.label}
                  </p>
                ) : null}
                {group.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-current={option.id === value ? "true" : undefined}
                    onClick={() => select(option.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent"
                  >
                    {option.name}
                    {option.id === value ? (
                      <CheckIcon className="size-4" />
                    ) : null}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
