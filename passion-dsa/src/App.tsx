import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ----- domain data -----
const INTERESTS = ["Dance", "Poetry", "Cooking", "Sports", "Gaming", "Music"] as const;
type Interest = typeof INTERESTS[number];

const CONCEPTS = ["Stack", "Queue", "Hash Map", "Binary Search", "Recursion", "Graph"] as const;
type Concept = typeof CONCEPTS[number];

// simple “generator”: returns analogy + steps + code snippet
function generateExplanation(interest: Interest, concept: Concept) {
  const flavor = {
    Dance: { item: "move", place: "routine", group: "dancers" },
    Poetry: { item: "line", place: "stanza", group: "poems" },
    Cooking: { item: "step", place: "recipe", group: "ingredients" },
    Sports: { item: "play", place: "playbook", group: "players" },
    Gaming: { item: "action", place: "combo", group: "NPCs" },
    Music: { item: "bar", place: "setlist", group: "musicians" },
  }[interest];

  switch (concept) {
    case "Stack":
      return {
        analogy:
          `A Stack is like building a ${flavor.place}: you add each ${flavor.item} on top. ` +
          `When you undo, the last ${flavor.item} you added comes off first (LIFO).`,
        steps: [
          `Push: add a ${flavor.item} to the top of the ${flavor.place}.`,
          "Top always points to the most recent item.",
          `Pop: remove the top ${flavor.item} first (reverse order).`,
          "Great for undo, back navigation, parsing.",
        ],
        code: `// Stack in TypeScript
const stack: string[] = [];
stack.push("${flavor.item} A");
stack.push("${flavor.item} B");
console.log(stack.pop()); // "${flavor.item} B"
console.log(stack.pop()); // "${flavor.item} A"`,
      };
    case "Queue":
      return {
        analogy:
          `A Queue is like ${flavor.group} lining up: first in is first served (FIFO).`,
        steps: [
          "Enqueue: add to the back.",
          "Dequeue: remove from the front.",
          "Fair ordering, used in scheduling and BFS.",
        ],
        code: `// Queue in TypeScript
const queue: string[] = [];
queue.push("first");
queue.push("second");
console.log(queue.shift()); // "first"`,
      };
    case "Hash Map":
      return {
        analogy:
          `A Hash Map is like labeled bins for your ${flavor.place}: find a bin by label in O(1) average time.`,
        steps: [
          "Hash function computes a bucket index from a key.",
          "Handle collisions (chaining or open addressing).",
          "O(1) average get/set; O(n) worst-case.",
        ],
        code: `// Map in TypeScript
const m = new Map<string, number>();
m.set("tempo", 120);
console.log(m.get("tempo")); // 120`,
      };
    case "Binary Search":
      return {
        analogy:
          `Binary Search is like guessing a BPM by halving ranges: check middle, then discard half.`,
        steps: [
          "Requires a sorted array.",
          "Pick middle, compare target.",
          "Keep the half that can contain the target.",
        ],
        code: `function bsearch(a: number[], x: number) {
  let l = 0, r = a.length - 1;
  while (l <= r) {
    const mid = (l + r) >> 1;
    if (a[mid] === x) return mid;
    if (a[mid] < x) l = mid + 1; else r = mid - 1;
  }
  return -1;
}`,
      };
    case "Recursion":
      return {
        analogy:
          `Recursion is like repeating a motif in a ${flavor.place}: each call tackles a smaller version until a base case.`,
        steps: [
          "Define base case.",
          "Make progress toward base.",
          "Trust the function to solve smaller subproblems.",
        ],
        code: `function factorial(n: number): number {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive step
}`,
      };
    case "Graph":
      return {
        analogy:
          `A Graph connects ${flavor.group} with relationships (edges). Explore paths, cycles, and communities.`,
        steps: [
          "Nodes (vertices) + edges (directed/undirected).",
          "DFS explores depth-first; BFS explores breadth-first.",
          "Used in maps, social networks, dependency graphs.",
        ],
        code: `const g: Record<string, string[]> = {
  A: ["B","C"], B:["D"], C:["D"], D:[]
};
// BFS from A
function bfs(start: string) {
  const q = [start], seen = new Set([start]);
  while (q.length) {
    const v = q.shift()!;
    for (const n of g[v]) if (!seen.has(n)) { seen.add(n); q.push(n); }
  }
  return seen;
}`,
      };
  }
}

// ----- tiny visual for Stack / Queue -----
function BarsVisualizer({ items, type }: { items: string[]; type: "Stack" | "Queue" }) {
  return (
    <div className="relative h-64 rounded-xl border border-dashed bg-white/70 p-3">
      <div className="absolute left-3 top-2 text-xs text-gray-500">
        {type === "Stack" ? "Top →" : "Front →"}
      </div>
      <div className="absolute right-3 top-2 text-xs text-gray-500">size: {items.length}</div>
      <div className="h-full flex items-end justify-center gap-2">
        <AnimatePresence initial={false}>
          {items.map((label, i) => (
            <motion.div
              key={label + i}
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-28 rounded-xl border border-amber-300 bg-gradient-to-r from-yellow-200 to-amber-200 px-3 py-2 text-center shadow"
            >
              {label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ----- main app -----
export default function App() {
  const [interest, setInterest] = useState<Interest | null>(null);
  const [concept, setConcept] = useState<Concept | null>(null);
  const exp = useMemo(
    () => (interest && concept ? generateExplanation(interest, concept) : null),
    [interest, concept]
  );

  // small interactive stack/queue demo
  const [stack, setStack] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const demoItems = useMemo(() => {
    if (!interest) return ["Item A", "Item B", "Item C", "Item D"];
    const map: Record<Interest, string> = {
      Dance: "Move",
      Poetry: "Line",
      Cooking: "Step",
      Sports: "Play",
      Gaming: "Action",
      Music: "Bar",
    };
    const base = map[interest];
    return [`${base} A`, `${base} B`, `${base} C`, `${base} D`];
  }, [interest]);

  const canVisualize = concept === "Stack" || concept === "Queue";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <header className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">PassionDSA</h1>
        <p className="text-gray-600">Explain CS concepts through what you love.</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Step 1: interest */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1) Pick your interest</h2>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                onClick={() => {
                  setInterest(i);
                  setConcept(null);
                  setStack([]);
                  setQueue([]);
                }}
                className={`px-4 py-2 rounded-full border transition ${
                  interest === i
                    ? "bg-pink-500 text-white border-pink-600"
                    : "bg-white hover:bg-pink-50 border-pink-200 text-pink-700"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: concept */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2) Choose a concept</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CONCEPTS.map((c) => (
              <button
                key={c}
                disabled={!interest}
                onClick={() => {
                  setConcept(c);
                  setStack([]);
                  setQueue([]);
                }}
                className={`px-3 py-2 rounded-lg text-sm border transition ${
                  concept === c
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                } ${!interest ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        {interest && concept && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Explanation card */}
            <div className="bg-white/80 rounded-2xl shadow p-5">
              <h3 className="text-xl font-semibold mb-2">
                {concept} explained for {interest.toLowerCase()}
              </h3>
              <p className="mb-3 leading-relaxed">{exp?.analogy}</p>
              <ul className="list-disc ml-6 mb-4 text-gray-700">
                {exp?.steps.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
              <h4 className="font-medium mb-1">Code (TypeScript)</h4>
              <pre className="bg-gray-100 p-3 rounded-lg overflow-auto text-sm">
                <code>{exp?.code}</code>
              </pre>
            </div>

            {/* Visualizer or friendly hint */}
            <div className="bg-white/80 rounded-2xl shadow p-5">
              {canVisualize ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    {concept === "Stack" ? (
                      <>
                        <button
                          className="px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                          onClick={() =>
                            setStack((s) =>
                              [...s, demoItems[(s.length % demoItems.length)]]
                            )
                          }
                        >
                          Push
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50"
                          onClick={() => setStack((s) => s.slice(0, -1))}
                          disabled={stack.length === 0}
                        >
                          Pop
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                          onClick={() =>
                            setQueue((q) =>
                              [...q, demoItems[(q.length % demoItems.length)]]
                            )
                          }
                        >
                          Enqueue
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50"
                          onClick={() => setQueue((q) => q.slice(1))}
                          disabled={queue.length === 0}
                        >
                          Dequeue
                        </button>
                      </>
                    )}
                    <button
                      className="ml-auto px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        setStack([]);
                        setQueue([]);
                      }}
                    >
                      Reset
                    </button>
                  </div>

                  {concept === "Stack" ? (
                    <BarsVisualizer items={[...stack]} type="Stack" />
                  ) : (
                    <BarsVisualizer items={[...queue]} type="Queue" />
                  )}

                  <p className="mt-3 text-sm text-gray-600">
                    Try the buttons to see {concept === "Stack" ? "LIFO" : "FIFO"} in action.
                  </p>
                </>
              ) : (
                <div className="text-gray-700">
                  Visual coming soon for <span className="font-medium">{concept}</span> — for now,
                  use the analogy and code on the left. 🙌
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!interest && (
          <div className="rounded-2xl border border-dashed bg-white/70 p-6 text-gray-600">
            pick an interest to get a personalized explanation ✨
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-500 pb-6">
        built fast with react, typescript, tailwind, framer-motion
      </footer>
    </div>
  );
}
