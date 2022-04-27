import { Card, Col, Row } from 'antd';
import React from 'react';
import { RepoMeta } from '../../types';

// import "./index.css";
import 'antd/dist/antd.css'

const Gallery: React.FC = () => {
  let data: RepoMeta[] = [
    {
      repo: "site-latex", video: undefined, image: "https://raw.githubusercontent.com/Unn4m3DD/site_latex/master/latex_home.png",
      title: "Site LateX", subtitle: "Website with LateX Tutorials"
    },
    {
      repo: "site-latex", video: undefined, image: "https://raw.githubusercontent.com/Unn4m3DD/site_latex/master/latex_home.png",
      title: "Site LateX", subtitle: "Website with LateX Tutorials"
    },
    {
      repo: "site-latex", video: undefined, image: "https://raw.githubusercontent.com/Unn4m3DD/site_latex/master/latex_home.png",
      title: "Site LateX", subtitle: "Website with LateX Tutorials"
    }
  ]
  return <Row gutter={[32, 32]} justify='center'>
    {data.map(item =>
      <Col>
        <Card
          key={item.repo}
          hoverable
          style={{ width: 450 }}
          cover={
            item.video !== undefined ?
              <video loop autoPlay muted>
                <source src={item.video} type="video/mp4" />
              </video> :
              <img src={item.image} />
          }
        >
          <Card.Meta
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {item.title}
                <a href={`https://${item.repo}.unn4m3dd.xyz`}>View Website</a>
              </div>
            }
            description={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {item.subtitle}
                <a href={`https://github.com/Unn4m3DD/${item.repo}`}><i style={{ fontSize: "30px" }} className="fa fa-github"></i></a>
              </div>
            }
          />
        </Card>
      </Col>
    )}
  </Row>
}

export default Gallery;