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
import type { Instructor } from "@/types/schedule";
import type { Class, ClassFilters } from "@/types/classes";

export function ClassesToolbar({
  classes,
  instructors,
  filters,
  onFilterChange,
  onAddClass,
}: {
  classes: Class[];
  instructors: Instructor[];
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
          value={filters.classId}
          onValueChange={(value) => updateFilter("classId", value)}
        >
          <SelectTrigger className="h-9 min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("classes.allClasses")}</SelectItem>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.instructorId}
          onValueChange={(value) => updateFilter("instructorId", value)}
        >
          <SelectTrigger className="h-9 min-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("classes.allInstructors")}</SelectItem>
            {instructors.map((instructor) => (
              <SelectItem key={instructor.id} value={instructor.id}>
                {instructor.name}
              </SelectItem>
            ))}
            <SelectItem value="none">
              {t("classes.noInstructorAssigned")}
            </SelectItem>
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
