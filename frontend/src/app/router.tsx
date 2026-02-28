import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { TeamPage } from '@/pages/TeamPage';
import { SpecialistPage } from '@/pages/SpecialistPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { MediationPage } from '@/pages/MediationPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { FaqPage } from '@/pages/FaqPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { BookingPage } from '@/pages/BookingPage';
import { SearchResultsPage } from '@/pages/SearchResultsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'team/:slug', element: <SpecialistPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'mediation', element: <MediationPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
