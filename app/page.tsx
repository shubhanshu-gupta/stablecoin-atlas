import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <main className={styles.main}>

        {/* Background Glow */}
        <div className={styles.glow}></div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            The Global Stablecoin Ecosystem
          </div>

          <h1 className={`${styles.title} text-gradient`}>
            Your Guide to the <br />
            Future of Money
          </h1>

          <p className={styles.subtitle}>
            Understand the latest developments, learn how stablecoins work,
            explore career opportunities, and use them in real life.
            Stablecoin Atlas is your personal guide.
          </p>

          <div className={styles.actions}>
            <Link
              href="/learning"
              className={styles.primaryBtn}
            >
              Start Learning
            </Link>
            <Link
              href="/latest"
              className={styles.secondaryBtn}
            >
              Latest News
            </Link>
          </div>
        </div>

        {/* Feature Grid Mockup */}
        <div className={styles.featureGrid}>
          {[
            { title: "Understand", desc: "Stay updated with the latest news and ecosystem developments." },
            { title: "Learn", desc: "Master the basics to advanced concepts of stablecoins." },
            { title: "Careers", desc: "Find your next role in the growing stablecoin industry." },
            { title: "Real Life", desc: "Practical guides on using stablecoins for payments and more." }
          ].map((feature, i) => (
            <div key={i} className={`glass-panel ${styles.featureCard}`}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer moved to layout.tsx */}
    </div>
  );
}
