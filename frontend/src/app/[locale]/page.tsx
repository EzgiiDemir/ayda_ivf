import { useTranslations } from 'next-intl';
import Hero from "@/src/components/sections/Hero";
import Welcome from "@/src/components/sections/Welcome";
import TreatmentMethods from "@/src/components/sections/TreatmentMethods";
import ContactMap from "@/src/components/sections/ContactMap";
export default function HomePage() {
    const t = useTranslations();

    return (
        <div>
            <Hero />
            <Welcome />
            <TreatmentMethods />
            <ContactMap />
        </div>
    );
}
