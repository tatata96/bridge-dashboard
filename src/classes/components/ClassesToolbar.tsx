import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n";
import type { ClassFilters } from "@/types/classes";

export type CategoryFilterOption = { id: string; name: string };

export function ClassesToolbar({
  categoryOptions,
  filters,
  onFilterChange,
  onAddClass,
}: {
  categoryOptions: CategoryFilterOption[];
  filters: ClassFilters;
  onFilterChange: (filters: ClassFilters) => void;
  onAddClass: () => void;
}) {
  const { t } = useI18n();

  function updateFilter(key: keyof ClassFilters, value: string) {
    onFilterChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex w-full items-center justify-between gap-3 max-[1100px]:flex-col max-[1100px]:items-stretch">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.categoryId}
          onValueChange={(value) => updateFilter("categoryId", value)}
        >
          <SelectTrigger className="h-9 min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("classes.allClasses")}</SelectItem>
            {categoryOptions.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button className="h-9" onClick={onAddClass}>
          <PlusIcon data-icon="inline-start" />
          {t("classes.addClass")}
        </Button>
      </div>
    </div>
  );
}
