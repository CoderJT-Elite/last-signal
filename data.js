/* Last Signal: content. Every fact below comes from a NASA page saved in sources/ (see REFERENCES.md).
   "receipts" are word-for-word sentences from those pages; tools/verify_receipts.py checks them. */
window.LAST_SIGNAL = {
  asOf: "2026-11-14",
  endings: {
    dust:    { label: "Buried in dust",    lesson: "Solar power needs sunlight. Dust on the panels, or a dust storm overhead, starves a robot of energy." },
    power:   { label: "Power faded",       lesson: "A nuclear power source slowly weakens as its fuel decays, until the signal is too faint to hear." },
    off:     { label: "Switched off",      lesson: "Some missions end because people on Earth stop them, not because the machine fails." },
    stopped: { label: "Stopped answering", lesson: "A machine that only works in daylight has to survive the long, cold lunar night." },
    broken:  { label: "Broken blade",      lesson: "One damaged part can end a mission, even when everything else still works." }
  },
  pioneerNow: {
    asOf: "2026-11-14",
    auFromEarth: 141.36,
    source: "NASA/JPL Horizons, saved in sources/horizons-pioneer10.txt"
  },
  /* Pioneer 10 distance from Earth in AU, one value per UTC day from 2026-11-01. NASA/JPL Horizons (target -23, observer Earth centre, quantity 20), saved in sources/horizons-pioneer10-daily.txt. */
  pioneerDaily: { start: "2026-11-01", au: [141.4,141.395,141.391,141.387,141.383,141.38,141.376,141.373,141.37,141.368,141.365,141.363,141.362,141.36,141.359,141.358,141.357,141.356,141.356,141.356,141.357,141.357,141.358,141.359,141.361,141.363,141.365,141.367,141.37,141.373,141.376,141.379,141.383,141.387,141.392,141.397,141.402,141.407,141.413,141.419,141.425,141.432,141.438,141.446,141.453,141.461,141.469,141.478,141.486,141.495,141.505,141.514,141.524,141.535,141.545,141.556,141.567,141.578,141.59,141.602,141.615,141.627,141.64,141.653,141.667,141.681,141.695,141.709,141.724,141.738,141.754,141.769,141.785,141.801,141.817,141.833,141.85,141.867,141.884,141.902,141.919,141.937,141.956,141.974,141.993,142.011,142.03,142.05,142.069,142.089,142.109,142.129,142.149,142.17,142.19,142.211,142.232,142.254,142.275,142.296,142.318,142.34,142.362,142.384,142.406,142.429,142.451,142.474,142.497,142.52,142.543,142.566,142.589,142.612,142.636,142.659,142.683,142.706,142.73,142.754,142.778,142.802,142.826,142.849,142.873,142.898,142.922,142.946,142.97,142.994,143.018,143.042,143.066,143.09,143.114,143.139,143.163,143.187,143.211,143.234,143.258,143.282,143.306,143.33,143.353,143.377,143.4,143.424,143.447,143.47,143.493,143.517,143.539,143.562,143.585,143.608,143.63,143.652,143.675,143.697,143.719,143.741,143.762,143.784,143.805,143.826,143.847,143.868,143.889,143.909,143.929,143.95,143.97,143.989,144.009,144.028,144.047,144.066,144.085,144.103,144.122,144.14,144.158,144.175,144.193,144.21,144.227,144.244,144.26,144.276,144.292,144.308,144.324,144.339,144.354,144.368,144.383,144.397,144.411,144.425,144.438,144.451,144.464,144.477,144.489,144.501,144.513,144.525,144.536,144.547,144.558,144.568,144.578,144.588,144.598,144.607,144.616,144.625,144.633,144.641,144.649,144.657,144.664,144.671,144.678,144.684,144.69,144.696,144.702,144.707,144.712,144.717,144.721,144.725,144.729,144.733,144.736,144.739,144.742,144.745,144.747,144.749,144.751,144.752,144.753,144.754,144.755,144.755,144.755,144.755,144.755,144.754,144.753,144.752,144.751,144.749,144.747,144.745,144.742,144.74,144.737,144.734,144.731,144.727,144.723,144.719,144.715,144.711,144.706,144.701,144.696,144.691,144.685,144.68,144.674,144.668,144.662,144.655,144.649,144.642,144.635,144.628,144.62,144.613,144.605,144.598,144.59,144.582,144.574,144.565,144.557,144.548,144.54,144.531,144.522,144.513,144.504,144.495,144.485,144.476,144.467,144.457,144.447,144.438,144.428,144.418,144.408,144.398,144.388,144.378,144.368,144.358,144.348,144.337,144.327,144.317,144.307,144.296,144.286,144.276,144.266,144.256,144.245,144.235,144.225,144.215,144.205,144.195,144.185,144.175,144.165,144.155,144.146,144.136,144.126,144.117,144.107,144.098,144.089,144.08,144.071,144.062,144.053,144.044,144.036,144.028,144.019,144.011,144.003,143.995,143.988,143.98,143.973,143.966,143.959,143.952,143.945,143.939,143.933,143.927,143.921,143.915,143.91,143.904,143.899,143.895,143.89,143.886,143.881,143.878,143.874,143.87,143.867,143.864,143.862,143.859,143.857,143.855,143.854,143.852,143.851,143.85,143.85,143.849,143.849,143.849,143.85,143.851,143.852,143.853,143.855,143.857,143.859,143.862,143.865,143.868,143.871,143.875,143.879,143.883,143.888,143.893,143.898,143.904,143.91,143.916,143.922,143.929,143.936,143.944,143.951,143.959,143.968,143.976,143.985,143.994,144.004,144.014,144.024,144.034,144.045,144.056,144.067,144.079,144.091,144.103] },
  machines: [
    {
      id: "apollo11",
      name: "Apollo 11 EASEP",
      kind: "Moon · science station",
      where: "Sea of Tranquility, Moon (0.67° N, 23.47° E)",
      last: "1969-08-27", lastWord: "Stopped answering commands", precision: "day",
      ending: "stopped", tone: 196, rate: 3.0,
      sections: [
        ["What it was", "Eagle was the first crewed vehicle to land on the Moon. Its lower half stayed behind as a launch platform. Next to it the astronauts set up EASEP, a small science station with a seismometer to feel moonquakes and a detector for moon dust."],
        ["Why it went", "Neil Armstrong and Buzz Aldrin were the first people to walk on the Moon. EASEP was the forerunner of the longer-lived science stations on later Apollo missions."],
        ["What it did", "The crew collected 21.55 kg of lunar rock and soil to bring home. EASEP was built to measure moonquakes and the makeup of the Moon's crust and interior."],
        ["How it went quiet", "EASEP had two solar panels and could only run during lunar daylight. On 27 August 1969, near noon of its second lunar day, it stopped accepting commands from Earth and the experiment was ended. The NASA page I used does not say why."]
      ],
      receipts: [
        ["apollo11.txt", "was the first crewed vehicle to land on the Moon."],
        ["apollo11.txt", "the EASEP could only operate during lunar day"],
        ["apollo11.txt", "on 27 August 1969, near noon of this second lunar day, the EASEP no longer accepted commands from Earth stations and the experiment was terminated."],
        ["apollo11.txt", "collected 21.55 kg of lunar rock and soil."]
      ],
      links: [["NASA NSSDCA: Apollo 11 Lunar Module and EASEP", "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C"]]
    },
    {
      id: "apollo12",
      name: "Apollo 12 ALSEP",
      kind: "Moon · science station",
      where: "Moon (3.01° S, 23.42° W)",
      last: "1977-09-30", lastWord: "Shut down", precision: "day",
      ending: "off", tone: 262, rate: 2.4,
      sections: [
        ["What it was", "A full science station called ALSEP, with a seismometer, an ion detector and other instruments wired to a central station. A small nuclear generator (an RTG) powered it with about 70 watts, roughly one bright light bulb."],
        ["Why it went", "Pete Conrad and Alan Bean landed within about 180 meters of Surveyor 3, a probe that had landed in 1967. They walked to it and brought back about 10 kg of its parts for study. ALSEP stayed behind to keep working on the Moon."],
        ["What it did", "The station was turned on on 19 November 1969. When the crew's spent lander was crashed into the Moon on purpose, about 60 km from the station, it made the first recorded artificial moonquake."],
        ["How it went quiet", "ALSEP worked for almost eight years. It was shut down on 30 September 1977, along with the other Apollo science stations. The NASA page I used does not say why."]
      ],
      receipts: [
        ["apollo12.txt", "was turned on at 14:21 UT on 19 November 1969 and shut down along with the other ALSEP stations on 30 September 1977."],
        ["apollo12.txt", "The RTG produced approximately 70 W DC at 16 V."],
        ["apollo12.txt", "creating the first recorded artificial moonquake"],
        ["apollo12.txt", "bringing back about 10 kg of parts for later examination on Earth"]
      ],
      links: [["NASA NSSDCA: Apollo 12 Lunar Module and ALSEP", "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C"]]
    },
    {
      id: "pioneer10",
      name: "Pioneer 10",
      kind: "Deep space · probe",
      where: "Leaving the Solar System",
      last: "2003-01-23", lastWord: "Last, very weak signal", precision: "day",
      ending: "power", tone: 330, rate: 1.6,
      sections: [
        ["What it was", "NASA's first mission to the outer planets, launched on 2 March 1972. It was designed for a 21-month mission to fly past Jupiter."],
        ["Why it went", "To get close to Jupiter, the giant planet that no spacecraft had visited."],
        ["What it did", "It was the first spacecraft to fly past Jupiter, and then it kept going. It worked for more than 30 years, far beyond its plan."],
        ["How it went quiet", "Its radioisotope power source slowly decayed. Pioneer's last, very weak signal was received on 23 January 2003, from about 7.6 billion miles away. On 7 February 2003 the Deep Space Network listened again and detected nothing."]
      ],
      receipts: [
        ["pioneer10-mission.txt", "Originally designed for a 21-month mission to fly by Jupiter, Pioneer 10 lasted more than 30 years."],
        ["pioneer10-mission.txt", "First spacecraft to fly past Jupiter"],
        ["pioneer10-last.md", "Pioneer's last, very weak signal was received on 23 January 2003."],
        ["pioneer10-last.md", "NASA engineers report that Pioneer 10's radioisotope power source has decayed"],
        ["pioneer10-mission.txt", "Pioneer 10 sent its last signal to Earth in January 2003 from a distance of 7.6 billion miles (12.23 billion kilometers)."],
        ["pioneer10-last.md", "One final attempt was made to locate Pioneer's 10 signal on March 3-5, 2006"],
        ["pioneer10-last.md", "Aldebaran is about 68 light years away and it will take Pioneer over 2 million years to reach it."]
      ],
      links: [
        ["NASA Science: Pioneer 10", "https://science.nasa.gov/mission/pioneer-10/"],
        ["NASA Science: Pioneer 10 sends last signal", "https://science.nasa.gov/missions/pioneer/pioneer-10-sends-last-signal/"]
      ]
    },
    {
      id: "opportunity",
      name: "Opportunity",
      kind: "Mars · rover",
      where: "Mars (landed 24 January 2004)",
      last: "2018-06-10", lastWord: "Last contact with Earth", precision: "day",
      ending: "dust", tone: 392, rate: 1.2,
      sections: [
        ["What it was", "A solar-powered robot geologist on wheels, one of two identical twins: Spirit and Opportunity."],
        ["Why it went", "To look for signs of past water on Mars."],
        ["What it did", "By studying the rocks, the twins confirmed that water was long standing on the surface of Mars in ancient times."],
        ["How it went quiet", "Opportunity last communicated with Earth on 10 June 2018, as a planet-wide dust storm blanketed the place where the solar-powered rover sat."]
      ],
      receipts: [
        ["opportunity.txt", "Look for signs of past water on Mars"],
        ["opportunity.txt", "confirmed that water was long standing on the surface of Mars in ancient times."],
        ["opportunity.txt", "Opportunity last communicated with Earth on June 10, 2018, as a planet-wide dust storm blanketed the solar-powered rover's location on Mars."]
      ],
      links: [["NASA Science: Spirit and Opportunity", "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/"]]
    },
    {
      id: "insight",
      name: "InSight",
      kind: "Mars · lander",
      where: "Mars",
      last: "2022-12-15", lastWord: "Last contact with Earth", precision: "day",
      ending: "dust", tone: 247, rate: 0.9,
      sections: [
        ["What it was", "A lander that stayed in one spot and listened to Mars from the inside. It was designed to take the planet's vital signs: its pulse, temperature and reflexes."],
        ["Why it went", "To study the structure of the inside of Mars."],
        ["What it did", "It collected marsquake data for more than four years. Its sensors even caught a low rumble from the Martian wind, blowing at an estimated 10 to 15 mph on 1 December 2018."],
        ["How it went quiet", "Dust had covered its solar panels, so they made less power. Mission controllers could not reach the lander after two consecutive attempts and concluded its batteries had run out of energy. The last time InSight communicated with Earth was 15 December 2022, and NASA ended the mission on 21 December 2022."]
      ],
      receipts: [
        ["insight-mission.txt", "InSight studied the deep interior of Mars and was designed to take the planet's vital signs: its pulse, temperature, and reflexes."],
        ["insight-mission.txt", "InSight sensors captured a haunting low rumble caused by vibrations from the Martian wind, estimated to be blowing at 10 to 15 mph"],
        ["insight-end.md", "The last time InSight communicated with Earth was Dec. 15."],
        ["insight-end.md", "unable to contact the lander after two consecutive attempts, leading them to conclude the spacecraft's solar-powered batteries have run out of energy"],
        ["insight-end.md", "NASA's InSight mission has ended after more than four years of collecting unique science on Mars."]
      ],
      links: [
        ["NASA Science: InSight", "https://science.nasa.gov/mission/insight/"],
        ["NASA: InSight mission retired", "https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/"]
      ]
    },
    {
      id: "ingenuity",
      name: "Ingenuity",
      kind: "Mars · helicopter",
      where: "Mars",
      last: "2024-01-18", lastWord: "Last flight", precision: "day",
      ending: "broken", tone: 523, rate: 4.0,
      sections: [
        ["What it was", "A small helicopter carried to Mars as a technology demonstration."],
        ["Why it went", "To show that powered flight on Mars was possible. On 19 April 2021 it made the first powered, controlled flight on the Red Planet."],
        ["What it did", "It was planned to make no more than five test flights in 30 days. It completed 72 flights across nearly three years, and became an aerial scout for scientists and rover planners."],
        ["How it went quiet", "On 18 January 2024 it made its last flight. About 1 meter above the surface it lost contact with the rover that relays its signals. Pictures sent later showed that one or more rotor blades were damaged during landing, so it could no longer fly. NASA ended the mission on 25 January 2024, when the helicopter was still upright and in communication."]
      ],
      receipts: [
        ["ingenuity-mission.txt", "Designed to be a technology demonstration that would make no more than five test flights in 30 days, the helicopter eventually completed 72 flights across nearly three years"],
        ["ingenuity-end.md", "one or more of its rotor blades sustained damage during landing, and it is no longer capable of flight."],
        ["ingenuity-end.md", "Ingenuity lost contact with the rover, which serves as a communications relay for the rotorcraft."],
        ["ingenuity-mission.txt", "It flew for the last time on Jan. 18, 2024."]
      ],
      links: [
        ["NASA Science: Ingenuity", "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/"],
        ["NASA: Ingenuity mission ends", "https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/"]
      ]
    }
  ]
};
