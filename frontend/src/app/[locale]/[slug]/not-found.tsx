import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Sayfa bulunamadı</p>
                <Link
                    href="/"
                    className="text-primary-pink hover:underline"
                >
                    Ana sayfaya dön
                </Link>
            </div>
        </div>
    );
}