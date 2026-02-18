// Comparison.tsx — SEO/AEO section for "Better Coaching vs X" searches
// Target keywords: "AI coaching vs human coach", "better coaching vs chatgpt",
//                  "AI coaching app for founders vs hiring a coach"

export function Comparison() {
  return (
    <section className="bg-white px-4 py-20" aria-labelledby="comparison-heading">
      <div className="mx-auto max-w-5xl">
        <h2
          id="comparison-heading"
          className="text-3xl font-bold text-slate-900 md:text-4xl"
        >
          How Better Coaching compares
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          You have options when it comes to professional coaching. Here's how Better Coaching
          stacks up against the alternatives — honestly.
        </p>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 pr-6 text-left font-semibold text-slate-500 uppercase tracking-wide text-xs w-1/4">
                  Feature
                </th>
                <th className="py-4 px-4 text-center font-bold text-slate-900 bg-emerald-50 rounded-t-lg">
                  Better Coaching
                </th>
                <th className="py-4 px-4 text-center font-semibold text-slate-500">
                  Human Coach
                </th>
                <th className="py-4 px-4 text-center font-semibold text-slate-500">
                  Generic AI Chat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  feature: 'Expert methodology',
                  better: '✅ Built-in frameworks',
                  human: '✅ Yes',
                  generic: '❌ You build it yourself',
                },
                {
                  feature: 'Availability',
                  better: '✅ 24/7, instant',
                  human: '❌ 1–2× per month',
                  generic: '✅ 24/7',
                },
                {
                  feature: 'Cost',
                  better: '✅ Affordable plans',
                  human: '❌ $200–$500/session',
                  generic: '✅ Free–low cost',
                },
                {
                  feature: 'Structured accountability',
                  better: '✅ Built-in loops',
                  human: '✅ Yes',
                  generic: '❌ None by default',
                },
                {
                  feature: 'Scalable for teams',
                  better: '✅ Yes',
                  human: '❌ Time-limited',
                  generic: '⚠️ Requires setup',
                },
                {
                  feature: 'Deep personalization',
                  better: '✅ Expert frameworks + AI',
                  human: '✅ Highest',
                  generic: '⚠️ Generic responses',
                },
              ].map(({ feature, better, human, generic }) => (
                <tr key={feature}>
                  <td className="py-4 pr-6 font-medium text-slate-700">{feature}</td>
                  <td className="py-4 px-4 text-center text-slate-800 bg-emerald-50">{better}</td>
                  <td className="py-4 px-4 text-center text-slate-600">{human}</td>
                  <td className="py-4 px-4 text-center text-slate-600">{generic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-slate-600 text-base max-w-2xl">
          Better Coaching sits in the sweet spot: expert-designed methodology, delivered at AI
          speed and cost. It's not a replacement for a human coach when you need deep relational
          support — but for daily skill-building, accountability, and decision-practice, it
          outperforms every alternative on efficiency.
        </p>
      </div>
    </section>
  );
}
