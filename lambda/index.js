const AWS = require('aws-sdk');
const Sharp = require('sharp');

const S3 = new AWS.S3({ region: 'ap-northest-2' }); // 서울 region

// s3가 올라왔을때 헨들러 함수가 동작함.
exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // 버킷이름
  const Key = event.Records[0].s3.object.key; // 경로 + 파일명 (original/파일명.png)
  const filename = Key.split('/')[Key.split('/').length -1];
  const ext = Key.split('.')[Key.split('.').length -1];
  console.log(Bucket, key, filename, ext);

  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext; // jpg일경우 jpeg로 치환

  try {
    const s3Object = await S3.getObject({
      Bucket,
      Key,
    }).promise();

    console.log('original', s3Object.Body.length); // Body에 실제 데이터가 들어있고, length로는 사이즈를 알 수 있음.

    const resizedImage = await Sharp(s3Object.Body)
      .resize(800, 800, {
        fit: 'inside' // 원본 비율 유지를 위한 설정 (inside로 하면 비율도 맞게 800,800에 맞게 압축이 된다.)
      })
      .toFormat(requiredFormat)
      .toBuffer(); // 001011 과 같은 버퍼 데이터로 변환.

    await s3.putObject({
      Bucket,
      key: `thumb/${filename}`,
      Body: resizedImage,
    }).promise();

    return callback(null, `thumb/${filename}`);
  } catch (e) {
    console.error(e);
    return callback(e); // passport의 done이라고 생각하면 됨 callback(에러, 성공)
  }
};
