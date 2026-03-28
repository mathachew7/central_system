export default function TheWhiteHouse(): JSX.Element {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">The Central System</h1>
        <p className="page-description">
          Nepal's premier civic transparency portal for government data and citizen services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Our Mission</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700">
              The Centralized Government Transparency Platform serves as Nepal's premier civic transparency portal,
              providing citizens with direct access to government data, project information, and public services.
              We believe in open government and citizen empowerment through accessible information.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">What We Do</h2>
          </div>
          <div className="card-content">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Aggregate and present government project data from multiple ministries
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Publish official notices, announcements, and policy updates
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Provide a directory of government ministries and their responsibilities
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Facilitate citizen feedback through our complaint and tracking system
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Maintain independent verification of government data sources
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Government Structure</h2>
          <p className="card-description">Nepal operates under a federal democratic republic system</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Federal Level</h3>
            <p className="text-sm text-blue-700">
              National ministries, central policy, and federally managed programs.
            </p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Provincial Level</h3>
            <p className="text-sm text-green-700">
              Province-level implementation and regional governance coordination.
            </p>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">Local Level</h3>
            <p className="text-sm text-orange-700">
              Municipal and local-level service delivery and public-facing operations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Data Sources</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700">
              All information presented on this platform is sourced directly from official government websites
              and public records. We maintain links to original sources for verification and transparency.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Citizen Services</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700 mb-3">Our platform provides tools for citizens to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Track government project progress and budgets
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Stay informed about policy changes and announcements
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Submit complaints and track their resolution
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Access ministry contact information and services
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}