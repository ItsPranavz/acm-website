import React, { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { Calendar, Event, dateFnsLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

import styles from "../styles/pages/events.module.scss";
import "react-big-calendar/lib/css/react-big-calendar.css"; // calendar css
import { mockEvents } from "../data/mockEvents";
import EventPopup from "../components/common/EventPopup/EventPopup";

// see eventPropGetter
const getEventClassByEvent = (event: Event) => {
    let modifierStr = '';
    if (event.resource[0]) {
        const commitee = event.resource[0];
        modifierStr = `rbc-override-${commitee}`;
    }
    return ({
        className: `rbc-override-event ${modifierStr}`,
    });
};

function Events() {
    const [listedEvents, setListedEvents] = useState<Event[] | undefined>(mockEvents);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [eventResource, setEventResource] = useState<string[]>(['acm', '', '', '']);
    const [showModal, setShowModal] = useState<Boolean>(false);

    const handleSelectEvent = (event: Event) => {
        setEventResource(event ? event.resource : ['acm', '', '', '']);
        setActiveEvent(event);
        setShowModal(true);
    }

    return (
        <PageLayout title="Events | ACM at PEC" heading="Events" description="Upcoming and Ongoing events at PEC ACM">
            <div className={styles.events}>
                <p>Have a look at our calendar</p>
                <div className={styles.calendarWrapper}>
                    {showModal ? (
                        <EventPopup 
                            handleClose={() => {
                                setShowModal(false);
                            }}
                            title={activeEvent?.title as string}
                            subTitle={eventResource[1]}
                            description={eventResource.slice(2, eventResource.length - 1)}
                            imageUrl={eventResource[eventResource.length - 1].length === 0 
                                        ? `/assets/logos/${eventResource[0]}.png`
                                        : eventResource.slice(-1)[0]}
                            startDate={activeEvent?.start ? activeEvent.start : new Date()}
                            endDate={activeEvent?.end ? activeEvent.end : new Date()}
                        />
                    ) : (
                        <></>
                    )}

                    <Calendar
                        localizer={localizer}
                        events={listedEvents}
                        className={styles.calendar}
                        popup={true}
                        onSelectEvent={handleSelectEvent}
                        startAccessor={(event) =>
                            new Date(event.start ?? Date.now())
                        }
                        endAccessor={(event) =>
                            new Date(event.end ?? Date.now())
                        }
                        eventPropGetter={getEventClassByEvent}
                        views={{
                            month: true,
                            week: false,
                            day: false,
                            agenda: false,
                        }}

                        dayLayoutAlgorithm={"no-overlap"}
                    />
                </div>
            </div>
        </PageLayout >
    );
}

export default Events;
