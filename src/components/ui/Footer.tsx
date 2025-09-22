import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">ELearning Platform</h3>
          <p className="text-gray-400 mb-4">
            Empowering learners worldwide with quality education
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              © 2024 ELearning Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}