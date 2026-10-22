import Link from 'next/link';
import Navigation from '@/components/navigation';

export default function Landing() {
  return (
    <main>
      <Navigation />

      <section className='max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-12 items=center'>
        <div>
          <h1 className='font-display text-5xl leading-tight text-ink'>Every client call in one scope of truth</h1>
          <p className='mt-6 text-lg text-ink/70 max-w-md'>Freetracker turns your Teams, Zoom, and Skype call transcripts into a clear record of what was agreed, so nothing gets lost between the call and the invoice.</p>
          <Link href='/signup' className='inline-block mt-8 bg-clay text-paper px-6 py-3 rounded-sm hover:bg-ink transition-colors'>Start onboarding clients</Link>
        </div>
        <div className='bg-ink rounded-sm p-8 text-paper'>
          <p className='text-sm uppercase tracking-wide text-paper/60'>Scope of truth</p>
          <p className='mt-3 font-display text-xl'>&ldquo;Redesign homepage, 2 rounds of revisions, delivery by the 14th&rdquo;</p>
          <p className='mt-4 text-sm text-paper/60'>Confirmed from your call with Acme Co.</p>
        </div>
      </section>

      <section className='max-w-6xl mx-auto px-8 py-16 border-t border-ink/10'>
        <h2 className='font-display text-3xl text-ink mb-4'>Who we are</h2>
        <p className='text-ink/70 max-w-2xl'>Built for freelancers and small businesses who run client work over video calls and need a reilable record of what was decided.</p>
      </section>

      <section className='max-w-6xl mx-auto px-8 py-16 border-t border-ink/10'>
        <h2 className='font-display text-3xl text-ink mb-4'>What we do</h2>
        <p className='text-ink/70 max-w-2xl'>Book your call on the platform you already use, upload the transcript, and let Freetracker surface the scope, the deliverables, and the deadlines your client agreed to.</p>
      </section>

      <footer className='max-w-6xl max-auto px-8 py-12 border-t border-ink/10 text-sm text-ink/60'>
        <p>&copy; 2026 Freetracker.</p>
      </footer>
    </main>
  );
}
