export default function Footer() {
  const cls = "px-1 text-primary-500 hover:text-primary-700 underline";
  return (
    <footer className="mt-5 w-full px-3 text-center text-sm text-gray-400">
      <p>© 2025 Bibek Bhusal</p>
      <div>
        Also visit
        <a className={cls} href="https://github.com/bibekbhusal0/cgr">
          Source Code
        </a>
        and
        <a className={cls} href="https://github.com/BibekBhusal0/CGR/blob/main/credit.md">
          Assets Credits
        </a>
      </div>
    </footer>
  );
}
