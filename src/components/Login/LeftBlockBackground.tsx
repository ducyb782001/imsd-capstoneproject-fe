import React from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

function LeftBlockBackground(props) {
  const particlesInit = async (main) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main)
  }

  const particlesLoaded = (container) => {}
  return (
    <Particles
      id="tsparticles"
      width="40vw"
      height="50vh"
      init={particlesInit}
      // @ts-ignore
      // loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "#6A44D2",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
        retina_detect: true,
        config_demo: {
          hide_card: true,
          background_color: "#6A44D2",
          background_image: "",
          background_position: "50% 50%",
          background_repeat: "no-repeat",
          background_size: "cover",
        },
      }}
    />
  )
}

export default LeftBlockBackground
