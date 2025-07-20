import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ul className="list-none flex gap-4 underline font-mono">
        <li>
          <Link href="/one">one</Link>
        </li>
        <li>
          <Link href="/two">two</Link>
        </li>
        <li>
          <Link href="/three">three</Link>
        </li>
        <li>
          <Link href="/text">text distortion</Link>
        </li>
        <li>
          <Link href="/list">list animation</Link>
        </li>
      </ul>
    </div>
  );
}
