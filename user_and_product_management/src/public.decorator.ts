import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => {
    return applyDecorators(
        // NOTE(umut): I dont use global auth yet so the line below is not
        // necessary at the moment
        // SetMetadata(IS_PUBLIC_KEY, true),
        ApiOperation({ security: [] }),
    );
};
