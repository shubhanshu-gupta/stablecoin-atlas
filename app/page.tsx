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

        {/* Feature Grid */}
        <div className={styles.featureGrid}>
          {[
            { title: "Learn", desc: "Master from the basics to advanced mechanics of stablecoins.", href: "/learning" },
            { title: "Latest", desc: "Get the latest pulse, news, and ecosystem developments.", href: "/latest" },
            { title: "Careers", desc: "Find your next role in the growing stablecoin industry.", href: "/careers" }
          ].map((feature, i) => (
            <Link href={feature.href} key={i} className={`glass-panel ${styles.featureCard}`}>
              <h3 className={styles.featureTitle}>
                {feature.title} <span className={styles.arrow}>&rarr;</span>
              </h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer moved to layout.tsx */}
    </div>
  );
}
