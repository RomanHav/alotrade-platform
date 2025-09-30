import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SearchEnginesSettings() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">Налаштування у пошукових системах</h2>
      <div className="flex flex-col gap-2.5 bg-white dark:bg-neutral-800 p-2.5">
        <h3 className="text-xl text-[#0055FF] underline">Мета-заголовок</h3>
        <span className="text-sm text-[#B9B9B9]">https://alcotrade.com.ua/</span>
        <p className="text-base text-[#616161]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque enim ante, rutrum
          vel augue sit amet, pellentesque ultrices metus. Morbi quis condimentum purus. Etiam non
          lectus ante. Curabitur tincidunt ipsum nulla, ut consectetur metus cursus sed. Donec
          elementum a ipsum.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl">Змінити мета-заголовок</h3>
        <Input type="text" placeholder="Заголовок сайту у пошукових системах" className="w-full" />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl">Змінити мета-опис</h3>
        <Textarea
          placeholder="Опис сайту у пошукових системах"
          className="h-20 w-full resize-none"
        />
      </div>
    </div>
  );
}
