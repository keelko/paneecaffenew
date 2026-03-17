import React from 'react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';

const ContactInfo: React.FC = () => {
    return (
        <div id="contatti" className="bg-brand-red/5 py-16 scroll-mt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-brand-dark mb-10 text-center">Contattaci o Vieni a Trovarci</h2>
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white p-8 rounded-lg shadow-md border border-brand-red/10">
                    {/* Left Column: Info */}
                    <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
                        <div className="flex items-start gap-4">
                            <LocationMarkerIcon className="h-8 w-8 text-brand-red mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-brand-dark">Indirizzo</h3>
                                <p className="text-gray-600">
                                    Via Pasquale Stanislao Mancini 13,<br />
                                    83031 Ariano Irpino (AV),<br />
                                    Campania, Italia
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <WhatsAppIcon className="h-7 w-7 text-brand-red" />
                            <div>
                                <h3 className="text-xl font-semibold text-brand-dark">WhatsApp</h3>
                                <a href="https://wa.me/3908251728034" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-red transition-colors">+39 0825 172 8034</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <EnvelopeIcon className="h-7 w-7 text-brand-red" />
                            <div>
                                <h3 className="text-xl font-semibold text-brand-dark">Email</h3>
                                <a href="mailto:pane.caffebonito@gmail.com" className="text-gray-600 hover:text-brand-red transition-colors">pane.caffebonito@gmail.com</a>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Map */}
                    <div className="lg:w-1/2 h-80 lg:h-auto rounded-lg overflow-hidden shadow-lg border-2 border-brand-red/10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.597955520412!2d15.08632607663248!3d41.15589300645608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133a1f9743555555%3A0x1d5a782e4f0a0a9c!2sVia%20Pasquale%20Stanislao%20Mancini%2C%2013%2C%2083031%20Ariano%20Irpino%20AV!5e0!3m2!1sit!2sit!4v1716305943485!5m2!1sit!2sit"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mappa della posizione di Pane & Caffè"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;