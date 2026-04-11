import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg-primary">
      <p className="font-mono text-xs tracking-[0.12em] text-accent-blue/60 uppercase mb-4">
        Error 404
      </p>

      <h1 className="font-display font-bold text-4xl md:text-6xl text-center leading-tight">
        Lost in{" "}
        <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
          Spacetime
        </span>
      </h1>

      <p className="mt-4 text-text-secondary text-center max-w-md">
        The page you&apos;re looking for has drifted beyond the event horizon.
        Let&apos;s navigate you back.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm hover:shadow-[0_0_30px_var(--glow-accent)] transition-shadow duration-300"
      >
        Return Home
        <span>&rarr;</span>
      </Link>

      <div
        className="mt-12 h-[1px] w-48 mx-auto"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--divider-color), var(--divider-color), transparent)",
        }}
      />
    </div>
  );
}
