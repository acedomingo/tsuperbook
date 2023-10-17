import React from 'react';

const RouteData = [
      {
        id: "PUB00001",
        name: "QC Hall - Cubao",
        type: "Bus",
        landmarks: [
          {
            id: 1,
            name: "Quezon Memorial Circle",
            coordinates: [
                14.6514824,
                121.0493203 
            ]
          },
          {
            id: 9,
            name: "Art in Island",
            coordinates: [
                14.622624,
                121.0576357                
            ]
          },
          {
            id: 13,
            name: "Quezon City Hall",
            coordinates: [
                14.6464639,
                121.0500976                              
            ]
          }
        ]
      },

      {
        id: "PUB00002",
        type: "Bus",
        name: "QC Hall - Munoz",
        landmarks: [
          {
            id: 1,
            name: "Quezon Memorial Circle",
            coordinates: [
                14.6514824,
                121.0493203 
            ]
          },
          {
            id: 2,
            name: "SM North EDSA",
            coordinates: [
                14.6568153,
                121.0304496    
            ]
          },
          {
            id: 3,
            name: "Trinoma",
            coordinates: [
                14.6533554,
                121.0333699                            
            ]
          },
          {
            id: 4,
            name: "Vertis North",
            coordinates: [
                14.6496645,
                121.0370935               
            ]
          },
          {
            id: 5,
            name: "Ninoy Aquino Parks and Wildlife Center",
            coordinates: [
                14.6506256,
                121.0426477                                
            ]
          }
        ]
      },

      {
        id: "PUB00003",
        type: "Bus",
        name: "QC Hall - Robinsons Magnolia",
        landmarks: [
          {
            id: 1,
            name: "Quezon Memorial Circle",
            coordinates: [
                14.6514824,
                121.0493203 
            ]
          },
          {
            id: 5,
            name: "Ninoy Aquino Parks and Wildlife Center",
            coordinates: [
                14.6506256,
                121.0426477                                
            ]
          },
          {
            id: 6,
            name: "Robinsons Magnolia",
            coordinates: [
                14.6155512,
                121.0380647       
            ]
          },
          {
            id: 7,
            name:  "Centris Station Mall",
            coordinates: [
                14.6436396,
                121.0387789                             
            ]
          },
          {
            id: 11,
            name: "Gilmore IT Center",
            coordinates: [
                14.6186578,
                121.0318033   
            ]
          },
          {
            id: 13,
            name: "Quezon City Hall",
            coordinates: [
                14.6464639,
                121.0500976                
            ]
          }
        ]
      },


      {
        id: "PUB00004",
        type: "Bus",
        name: "Welcome Rotonda - Aurora/Katipunan",
        landmarks: [
          {
            id: 14,
            name: "Diocesan Shrine of Jesus the Divine Word",
            coordinates: [
                14.6239744,
                121.0298017
            ]
          }
        ]
      },

      {
        id: "PUJ00001",
        type: "Jeepney",
        name: "Aurora/Lauan - QMC",
        landmarks: [
          {
            id: 1,
            name: "Quezon Memorial Circle",
                coordinates: [
                14.6514824,
                121.0493203 
            ]
          },
          {
            id: 5,
            name: "Ninoy Aquino Parks and Wildlife Center",
            coordinates: [
                14.6506256,
                121.0426477                                
            ]
          },
          {
            id: 13,
            name: "Quezon City Hall",
            coordinates: [
                14.6464639,
                121.0500976                
            ]
          }
        ]
      },

      {
        id: "PUJ00002",
        type: "Jeepney",
        name: "EDSA/North Ave. - Project 6",
        landmarks: [
          {
            id: 2,
            name: "SM North EDSA",
            coordinates: [
                14.6568153,
                121.0304496    
            ]
          },
          {
            id: 3,
            name: "Trinoma",
            coordinates: [
                14.6533554,
                121.0333699                            
            ]
          },
          {
            id: 4,
            name: "Vertis North",
            coordinates: [
                14.6496645,
                121.0370935               
            ]
          }
        ]
      },

      {
        id: "PUJ00003",
        type: "Jeepney",
        name: "Marcos Ave. - Quirino Highway via Tandang Sora",
        landmarks: [
          {
            id: 10,
            name: "Tandang Sora Market",
            coordinates: [
                14.66509,
                121.0273173                  
            ]
          },
          {
            id: 15,
            name: "RMR Square Tandang Sora",
            coordinates: [
                14.6745429,
                121.0453486                       
            ]
          }
        ]
      },

      {
        id: "PUJ00004",
        type: "Jeepney",
        name: "Proj 2&3 - Welcome Rotonda",
        landmarks: [
          {
            id: 12,
            name: "Fisher Mall Quezon Ave",
            coordinates: [
                14.6336657,
                121.0195946                                 
            ]
          }
        ]
      },

      {
        id: "PUJ00005",
        type: "Jeepney",
        name: "SM North - UP",
        landmarks: [
          {
            id: 1,
            name: "Quezon Memorial Circle",
            coordinates: [
                14.6514824,
                121.0493203 
            ]
          },
          {
            id: 2,
            name: "SM North EDSA",
            coordinates: [
                14.6568153,
                121.0304496    
            ]
          },
          {
            id: 3,
            name: "Trinoma",
            coordinates: [
                14.6533554,
                121.0333699                            
            ]
          },
          {
            id: 4,
            name: "Vertis North",
            coordinates: [
                14.6496645,
                121.0370935               
            ]
          },
          {
            id: 5,
            name: "Ninoy Aquino Parks and Wildlife Center",
            coordinates: [
                14.6506256,
                121.0426477                                
            ]
          },
          {
            id: 8,
            name: "UP Sunken Garden",
            coordinates: [
                14.655216,
                121.0718477                                              
            ]
          },
          {
            id: 13,
            name: "Quezon City Hall",
            coordinates: [
                14.6464639,
                121.0500976                
            ]
          }
        ]
      },

      {
        id: "PUJ00006",
        type: "Jeepney",
        name: "Tandang Sora - Visayas Ave. via QC Hall",
        landmarks: [
          {
            id: 1,
            name: "Quezon Memorial Circle",
            coordinates: [
                14.6514824,
                121.0493203 
            ]
          },
          {
            id: 5,
            name: "Ninoy Aquino Parks and Wildlife Center",
            coordinates: [
                14.6506256,
                121.0426477                                
            ]
          },
          {
            id: 10,
            name: "Tandang Sora Market",
            coordinates: [
                14.66509,
                121.0273173                  
            ]
          },  
          {
            id: 13,
            name: "Quezon City Hall",
            coordinates: [
                14.6464639,
                121.0500976                
            ]
          },
          {
            id: 15,
            name: "RMR Square Tandang Sora",
            coordinates: [
                14.6745429,
                121.0453486                       
            ]
          }
        ]
      }
    ]

export default RouteData
