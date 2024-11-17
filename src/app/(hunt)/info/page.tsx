import Link from "next/link";

export default async function Home() {
  return (
    <div className="prose mx-auto w-4/5 space-y-3">
      <h1 className="text-center">Info</h1>
      <h3 id="what-is-this">What is this?</h3>
      <p>
        Puzzlethon is an event where we write, test, and publish an entire
        puzzlehunt in 24 hours.
      </p>
      <p>
        It’s light-hearted, low-stakes, and a great way to get into writing
        puzzles if you’re a Brown/RISD student.
      </p>
      <p>
        We’ll be livestreaming the event. If you’re curious about taking a look
        behind the scenes to see what goes into writing a puzzlehunt, check it
        out!
      </p>
      <p>
        Making a puzzlehunt requires all kinds of people with many different
        skillsets: we need <span className="font-bold">writers</span>,{" "}
        <span className="font-bold">programmers</span>,{" "}
        <span className="font-bold">artists</span>,{" "}
        <span className="font-bold">testers</span>, and more. If you’re
        interested in participating in Puzzlethon (and you’re a Brown or RISD
        student), fill out{" "}
        <Link
          href="https://forms.gle/sWsfF7gDDDtHwPKi7"
          className="text-blue-600 hover:underline"
        >
          this form
        </Link>
        !
      </p>
      <h3 id="what-s-a-puzzlehunt">What’s a puzzlehunt?</h3>
      <p>
        A puzzlehunt is an event where teams of people compete to solve puzzles.
        These puzzles can be anything: word games, logic puzzles, video games,
        physical objects, or in-person challenges.
      </p>
      <p>
        For a (much larger) example, take a look at last year’s{" "}
        <Link
          href="https://brownpuzzlehunt.com/"
          className="text-blue-600 hover:underline"
        >
          Brown Puzzlehunt
        </Link>
        .
      </p>
      <h3 id="when-is-it">When is it?</h3>
      <p>Writing will start on November 23rd, at noon ET.</p>
      <p>Puzzles will be released on November 24th, at noon ET.</p>
      <h3 id="who-are-you">Who are you?</h3>
      <p>
        We are Brown Puzzle Club, the home of the puzzlehunting community at
        Brown!
      </p>
      <p>
        There’s a little more information about us{" "}
        <Link
          href="https://brownpuzzle.club/"
          className="text-blue-600 hover:underline"
        >
          here
        </Link>
        .
      </p>
      <h3 id="why-are-you-doing-this">Why are you doing this?</h3>
      <p>A few reasons:</p>
      <ol className="list-inside list-decimal">
        <li>It'll be fun! We like making things.</li>
        <li>It's a great way for new writers to learn puzzle-writing.</li>
        <li>We want to test our brand-new tech stack before winter break.</li>
      </ol>
      <h3 id="how-can-i-be-involved">How can I be involved?</h3>
      <p>
        If you’re interested in participating in Puzzlethon (and you’re a Brown
        or RISD student), fill out{" "}
        <Link
          href="https://forms.gle/sWsfF7gDDDtHwPKi7"
          className="text-blue-600 hover:underline"
        >
          this form
        </Link>
        !
      </p>
      <p>
        If you’re not a Brown or RISD student, you can check out our livestream,
        and solve the puzzles once they release. (Come back later for more
        information!)
      </p>
    </div>
  );
}
