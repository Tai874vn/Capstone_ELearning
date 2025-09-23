import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-foreground">CyberSoft ELearning Platform</h3>
          <p className="text-muted-foreground mb-4">
            Empowering learners worldwide with quality education
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/danhmuckhoahoc?manhom=GP01" className="text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              © 2025 CyberSoft ELearning Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}