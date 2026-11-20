export default function Wordmark({ illustrated = true }: { illustrated?: boolean }) {
  return (
    <span className={illustrated ? "brand-lockup" : "brand-lockup brand-lockup--type"} aria-hidden="true">
      <span className="brand-lettering" />
      {illustrated && (
        <span className="brand-characters">
          <img src="./illustrations/prichudy/characters-reference.png" alt="" width="1536" height="1024" />
        </span>
      )}
    </span>
  );
}

