import type { MyCourse } from "@/lib/backend";
import { twoDigits } from "@/lib/format";
import { ChevronIcon, CloseIcon } from "./icons";

type Props = {
  courses: MyCourse[];
  currentSlug: string;
  onSelect: (slug: string) => void;
  onClose: () => void;
  onSupport?: () => void;
};

/** "My courses" side drawer. */
export function CoursesDrawer({ courses, currentSlug, onSelect, onClose, onSupport }: Props) {
  return (
    <div className="fixed inset-0 z-20 flex" role="dialog" aria-modal="true" aria-label="Мои курсы">
      <nav className="flex w-[82%] max-w-[400px] flex-col bg-(--app-card) px-5 pb-8">
        <div className="flex h-[60px] items-center gap-3">
          <button onClick={onClose} aria-label="Закрыть" className="flex size-7 items-center justify-center rounded-full bg-(--app-bg) text-(--app-hint)"><CloseIcon /></button>
          <h2 className="text-[17px] font-semibold">Мои курсы</h2>
        </div>
        <p className="mt-6 text-[13px] font-semibold uppercase text-(--app-accent)">Учитесь в своём темпе</p>
        <h3 className="mt-2 text-[24px] font-bold">Найдите свой фокус.</h3>
        <p className="mt-1 text-[15px] text-(--app-hint)">Все ваши курсы в одном месте.</p>
        <p className="mt-8 text-[13px] font-semibold uppercase text-(--app-hint)">Мои курсы</p>
        <ul className="mt-3 flex flex-col gap-4">
          {courses.map((course, index) => (
            <li key={course.id}>
              <button onClick={() => onSelect(course.slug)}
                className={`w-full rounded-2xl p-4 text-left ${course.slug === currentSlug ? "bg-(--app-highlight)" : "bg-(--app-bg)"}`}>
                <p className="text-[13px] font-semibold uppercase text-(--app-accent)">{twoDigits(index + 1)} / {course.category}</p>
                <p className="mt-2 text-[17px] font-semibold">{course.title}</p>
                <p className="mt-1 text-[13px] text-(--app-hint)">Открыто {course.unlockedLessons} из {course.totalLessons}</p>
                <p className="mt-3 flex items-center justify-between text-[13px] font-semibold text-(--app-accent)">
                  {course.unlockedLessons > 1 ? "Продолжить обучение" : "Начать обучение"} <ChevronIcon />
                </p>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-10 border-b border-(--app-separator)/50 pb-6 text-[15px] text-(--app-hint)">Учитесь понемногу каждый день.</p>
        {onSupport ? (
          <button onClick={onSupport} className="mt-5 flex items-center gap-1 text-left text-[17px] text-(--app-hint)">Поддержка <ChevronIcon /></button>
        ) : null}
        <p className="mt-auto text-[13px] font-semibold uppercase text-(--app-hint)">Forma Academy</p>
      </nav>
      <button className="flex-1 bg-black/30" aria-label="Закрыть меню" onClick={onClose} />
    </div>
  );
}
