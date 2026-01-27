import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCVStore } from '../../stores/cvStore';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/ui';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVDocument } from '../../features/export/CVDocument';

export function ExportPage() {
  const { id } = useParams<{ id: string }>();
  const { cv, loadCV, reset } = useCVStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCV(id).then(() => setIsLoading(false));
    }
    return () => reset();
  }, [id, loadCV, reset]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 mb-4">Resume not found</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Export Your Resume</h1>
        <p className="mt-2 text-gray-600">Download your resume as a PDF file</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center">
          {/* PDF Preview placeholder */}
          <div className="w-full max-w-md aspect-[1/1.414] bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">PDF Preview</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">{cv.name}</h2>
          <p className="text-gray-500 mb-6">Ready to download</p>

          <div className="flex gap-4">
            <Link to={`/editor/${cv.id}`}>
              <Button variant="outline">Back to Editor</Button>
            </Link>
            <PDFDownloadLink
              document={<CVDocument cv={cv} />}
              fileName={`${cv.name.replace(/\s+/g, '_')}.pdf`}
            >
              {({ loading }) => (
                <Button isLoading={loading}>
                  {loading ? 'Generating...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
}
